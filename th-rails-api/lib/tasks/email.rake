require 'ostruct'

namespace :email do
  desc "Test email configuration by sending a test email"
  task test: :environment do
    email = ENV['TEST_EMAIL'] || 'test@example.com'
    
    puts "Testing email configuration..."
    puts "SMTP Address: #{ActionMailer::Base.smtp_settings[:address]}"
    puts "SMTP Port: #{ActionMailer::Base.smtp_settings[:port]}"
    puts "SMTP Username: #{ActionMailer::Base.smtp_settings[:user_name]&.length&.positive? ? '[CONFIGURED]' : '[NOT SET]'}"
    puts "SMTP Password: #{ActionMailer::Base.smtp_settings[:password]&.length&.positive? ? '[CONFIGURED]' : '[NOT SET]'}"
    puts "Sending test email to: #{email}"
    puts ""
    
    begin
      # Create a temporary user object for testing
      test_user = OpenStruct.new(
        email: email,
        username: 'testuser',
        email_verification_token: 'test-token-123'
      )
      
      UserMailer.email_verification(test_user).deliver_now
      puts "✅ Test email sent successfully!"
      puts "Check your inbox at #{email}"
      
    rescue Net::SMTPAuthenticationError => e
      puts "❌ SMTP Authentication failed: #{e.message}"
      puts "Check your username and password. For Gmail, make sure you're using an App Password."
      
    rescue Net::SMTPServerBusy => e
      puts "❌ SMTP Server busy: #{e.message}"
      puts "The email provider may be temporarily unavailable."
      
    rescue Net::SMTPFatalError => e
      puts "❌ SMTP Fatal error: #{e.message}"
      puts "Check your SMTP configuration settings."
      
    rescue SocketError => e
      puts "❌ Connection error: #{e.message}"
      puts "Check your SMTP address and network connection."
      
    rescue => e
      puts "❌ Unexpected error: #{e.message}"
      puts "Full error: #{e.class}: #{e.message}"
      puts e.backtrace.first(5)
    end
  end
  
  desc "Show current email configuration"
  task config: :environment do
    puts "Current Email Configuration:"
    puts "="*50
    puts "Delivery Method: #{ActionMailer::Base.delivery_method}"
    puts "Perform Deliveries: #{ActionMailer::Base.perform_deliveries}"
    puts "Raise Delivery Errors: #{ActionMailer::Base.raise_delivery_errors}"
    puts ""
    puts "SMTP Settings:"
    puts "  Address: #{ActionMailer::Base.smtp_settings[:address]}"
    puts "  Port: #{ActionMailer::Base.smtp_settings[:port]}"
    puts "  Domain: #{ActionMailer::Base.smtp_settings[:domain]}"
    puts "  Username: #{ActionMailer::Base.smtp_settings[:user_name]&.length&.positive? ? '[CONFIGURED]' : '[NOT SET]'}"
    puts "  Password: #{ActionMailer::Base.smtp_settings[:password]&.length&.positive? ? '[CONFIGURED]' : '[NOT SET]'}"
    puts "  Authentication: #{ActionMailer::Base.smtp_settings[:authentication]}"
    puts "  STARTTLS: #{ActionMailer::Base.smtp_settings[:enable_starttls_auto]}"
    puts ""
    puts "Default URLs:"
    puts "  Default URL Options: #{ActionMailer::Base.default_url_options}"
    puts "  Default From: #{ENV.fetch('DEFAULT_FROM_EMAIL', 'noreply@taskhub.com')}"
  end
end 
