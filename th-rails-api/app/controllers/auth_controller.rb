class AuthController < ApplicationController
  
  # POST /auth/signup
  def signup
    @user = User.new(user_params)
    
    if @user.save
      UserMailer.email_verification(@user).deliver_now
      render json: { 
        message: 'User created successfully. Please check your email to verify your account.',
        user: user_response(@user)
      }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  # POST /auth/login
  def login
    # Support login with either username or email
    user = User.find_by(email: params[:email]) || User.find_by(username: params[:username])
    
    if user&.authenticate(params[:password])
      if user.email_verified?
        token = generate_token(user)
        render json: {
          message: 'Login successful',
          user: user_response(user),
          token: token
        }, status: :ok
      else
        render json: { 
          error: 'Please verify your email before logging in.',
          needs_verification: true
        }, status: :unauthorized
      end
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
  
  # POST /auth/verify_email
  def verify_email
    user = User.find_by(email_verification_token: params[:token])
    
    if user&.email_verification_token == params[:token]
      user.verify_email!
      render json: { message: 'Email verified successfully' }, status: :ok
    else
      render json: { error: 'Invalid verification token' }, status: :unprocessable_entity
    end
  end
  
  # POST /auth/resend_verification
  def resend_verification
    user = User.find_by(email: params[:email])
    
    if user
      if user.email_verified?
        render json: { error: 'Email is already verified' }, status: :unprocessable_entity
      else
        user.resend_email_verification
        render json: { message: 'Verification email sent' }, status: :ok
      end
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end
  
  # POST /auth/forgot_password
  def forgot_password
    user = User.find_by(email: params[:email])
    
    if user
      user.generate_password_reset_token
      user.save!
      UserMailer.password_reset(user).deliver_now
      render json: { message: 'Password reset email sent' }, status: :ok
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end
  
  # POST /auth/reset_password
  def reset_password
    user = User.find_by(password_reset_token: params[:token])
    
    if user && user.password_reset_token_valid?
      if user.update(password: params[:password], password_reset_token: nil, password_reset_sent_at: nil)
        render json: { message: 'Password reset successfully' }, status: :ok
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Invalid or expired reset token' }, status: :unprocessable_entity
    end
  end
  
  # GET /auth/me (get current user info with JWT)
  def me
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token
      begin
        decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: 'HS256')
        user_id = decoded_token[0]['user_id']
        user = User.find(user_id)
        
        render json: { user: user_response(user) }, status: :ok
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end
    else
      render json: { error: 'Token required' }, status: :unauthorized
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
  
  def user_response(user)
    {
      id: user.id,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified?,
      public: user.public,
      created_at: user.created_at
    }
  end
  
  def generate_token(user)
    payload = {
      user_id: user.id,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base, 'HS256')
  end
end 
