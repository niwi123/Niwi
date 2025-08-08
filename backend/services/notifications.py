import os
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.admin_email = os.environ.get('ADMIN_EMAIL', 'niwimedia1@gmail.com')
        logger.info("Email notifications disabled - API keys removed for security")

    async def send_admin_notification(self, subject: str, content: str, user_data: Dict[str, Any] = None):
        """Send email notification to admin - DISABLED"""
        logger.info(f"Email notification disabled - Subject: {subject}")
        logger.info(f"Would send to: {self.admin_email}")
        logger.info(f"Content: {content}")
        return True  # Return True to prevent errors in calling code

    async def send_new_user_notification(self, user_data: Dict[str, Any]):
        """Send notification when new user registers - DISABLED"""
        logger.info(f"New user notification disabled - User: {user_data.get('email')}")
        return True

    async def send_customer_request_notification(self, request_data: Dict[str, Any]):
        """Send notification when new customer request is created - DISABLED"""
        logger.info(f"Customer request notification disabled - Service: {request_data.get('service_type')}")
        return True

    async def notify_new_user_signup(self, user_data: Dict[str, Any]):
        """Notify admin of new user signup - DISABLED"""
        logger.info(f"New user signup notification disabled - User: {user_data.get('email')}")
        return True

    async def notify_new_customer_request(self, request_data: Dict[str, Any], customer_data: Dict[str, Any] = None):
        """Notify admin of new customer service request - DISABLED"""
        logger.info(f"Customer request notification disabled - Service: {request_data.get('service_category')}")
        return True

    async def notify_professional_verification_needed(self, professional_data: Dict[str, Any]):
        """Notify admin that a professional needs verification - DISABLED"""
        logger.info(f"Professional verification notification disabled - Business: {professional_data.get('business_name')}")
        return True

# Global instance
notification_service = NotificationService()