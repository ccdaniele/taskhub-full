class LikesController < ApplicationController
  before_action :set_post

  # POST /posts/:post_id/likes
  def create
    # For now, we'll use a default user (user with id 1)
    # In a real app, this would come from authentication
    user_id = params[:user_id] || 1
    
    @like = @post.likes.build(user_id: user_id)

    if @like.save
      render json: { 
        message: 'Post liked successfully', 
        likes_count: @post.likes_count,
        liked: true 
      }, status: :created
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/:post_id/likes
  def destroy
    # For now, we'll use a default user (user with id 1)
    # In a real app, this would come from authentication
    user_id = params[:user_id] || 1
    
    @like = @post.likes.find_by(user_id: user_id)
    
    if @like
      @like.destroy
      render json: { 
        message: 'Post unliked successfully', 
        likes_count: @post.likes_count,
        liked: false 
      }
    else
      render json: { error: 'Like not found' }, status: :not_found
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end
end
