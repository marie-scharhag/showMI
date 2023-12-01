from django.core.mail import get_connection, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_temporary_password_email(user, temporary_password):
    connection = get_connection()  # uses SMTP server specified in settings.py
    connection.open()

    subject = 'Welcome to showMI'
    html_message = render_to_string(f'welcome_email.html',
                                    {'user': user, 'temporary_password': temporary_password})
    plain_message = strip_tags(html_message)
    to_email = 'marie.scharhag@student.hs-rm.de'#user.email
    message = EmailMultiAlternatives(subject=subject, body=plain_message, from_email=None, to=[to_email], connection=connection)

    message.attach_alternative(html_message, "text/html")
    message.send()

    connection.close()