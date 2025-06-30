class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :update, :destroy]
  before_action :set_post, only: [:index, :create]

  # GET /posts/:post_id/comments
  def index
    @comments = @post.comments.includes(:user).recent
    render json: @comments, include: [:user]
  end

  # GET /comments/1
  def show
    render json: @comment, include: [:user, :post]
  end

  # POST /posts/:post_id/comments
  def create
    @comment = @post.comments.build(comment_params)
    # For now, we'll use a default user (user with id 1)
    # In a real app, this would come from authentication
    @comment.user_id = params[:user_id] || 1

    if @comment.save
      render json: @comment, status: :created, include: [:user]
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/1
  def update
    if @comment.update(comment_params)
      render json: @comment, include: [:user]
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /comments/1
  def destroy
    @comment.destroy
    head :no_content
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def set_post
    @post = Post.find(params[:post_id]) if params[:post_id]
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
