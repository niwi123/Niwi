import os
import logging
from typing import Dict, Any
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
        self.admin_email = os.environ.get('ADMIN_EMAIL', 'niwimedia1@gmail.com')
        self.sendgrid_client = None
        
        if self.sendgrid_api_key:
            self.sendgrid_client = SendGridAPIClient(api_key=self.sendgrid_api_key)
        else:
            logger.warning("SendGrid API key not found in environment variables")

    async def send_admin_notification(self, subject: str, content: str, user_data: Dict[str, Any] = None):
        """Send email notification to admin"""
        if not self.sendgrid_client:
            logger.error("SendGrid client not initialized")
            return False

        try:
            # Create the email content
            from_email = Email("noreply@niwi.com", "Niwi Platform")
            to_email = To(self.admin_email)
            
            # Add user data to content if provided
            if user_data:
                content += f"\n\nUser Details:\n"
                content += f"Name: {user_data.get('first_name', '')} {user_data.get('last_name', '')}\n"
                content += f"Email: {user_data.get('email', '')}\n"
                content += f"User Type: {user_data.get('user_type', '')}\n"
                content += f"Phone: {user_data.get('phone', 'Not provided')}\n"
                
                if user_data.get('user_type') == 'professional':
                    content += f"Business: {user_data.get('business_name', 'Not provided')}\n"
                    content += f"Service Categories: {', '.join(user_data.get('service_categories', []))}\n"

            mail = Mail(from_email, to_email, subject, Content("text/plain", content))

            # Send the email
            response = self.sendgrid_client.send(mail)
            logger.info(f"Admin notification sent successfully. Status code: {response.status_code}")
            return True

        except Exception as e:
            logger.error(f"Failed to send admin notification: {str(e)}")
            return False

    async def notify_new_user_signup(self, user_data: Dict[str, Any]):
        """Notify admin of new user signup"""
        user_type = user_data.get('user_type', 'unknown')
        subject = f"New {user_type.title()} Signup - Niwi Platform"
        
        content = f"A new {user_type} has signed up on the Niwi platform!"
        
        return await self.send_admin_notification(subject, content, user_data)

    async def notify_new_customer_request(self, request_data: Dict[str, Any], customer_data: Dict[str, Any] = None):
        """Notify admin of new customer service request"""
        subject = "New Service Request - Niwi Platform"
        
        content = f"A new service request has been submitted:\n\n"
        content += f"Service: {request_data.get('service_category', 'Not specified')}\n"
        content += f"Title: {request_data.get('title', 'No title')}\n"
        content += f"Description: {request_data.get('description', 'No description')}\n"
        content += f"Location: {request_data.get('city', '')}, {request_data.get('province', '')}\n"
        content += f"Budget: ${request_data.get('budget_min', 0)} - ${request_data.get('budget_max', 0)}\n"
        content += f"Timeline: {request_data.get('timeline', 'Not specified')}\n"
        
        if customer_data:
            content += f"\nCustomer Contact:\n"
            content += f"Name: {customer_data.get('first_name', '')} {customer_data.get('last_name', '')}\n"
            content += f"Email: {customer_data.get('email', '')}\n"
            content += f"Phone: {customer_data.get('phone', 'Not provided')}\n"

        return await self.send_admin_notification(subject, content)

    async def notify_professional_verification_needed(self, professional_data: Dict[str, Any]):
        """Notify admin that a professional needs verification"""
        subject = "Professional Verification Required - Niwi Platform"
        
        content = f"A new professional needs verification:\n\n"
        content += f"Business Name: {professional_data.get('business_name', 'Not provided')}\n"
        content += f"Service Categories: {', '.join(professional_data.get('service_categories', []))}\n"
        content += f"Years of Experience: {professional_data.get('years_experience', 'Not provided')}\n"
        content += f"Location: {professional_data.get('city', '')}, {professional_data.get('province', '')}\n"
        
        return await self.send_admin_notification(subject, content, professional_data)

# Global instance
notification_service = NotificationService()