class UserMailer < ApplicationMailer
  default from: ENV.fetch('DEFAULT_FROM_EMAIL', 'noreply@taskhub.com')

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.email_verification.subject
  #
  def email_verification(user)
    @user = user
    @verification_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3001')}/auth/verify-email?token=#{user.email_verification_token}"
    
    mail(
      to: @user.email,
      subject: 'Please verify your TaskHub account'
    )
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.password_reset.subject
  #
  def password_reset(user)
    @user = user
    @reset_url = "#{ENV.fetch('FRONTEND_URL', 'http://localhost:3001')}/auth/reset-password?token=#{user.password_reset_token}"
    
    mail(
      to: @user.email,
      subject: 'Reset your TaskHub password'
    )
  end
end
