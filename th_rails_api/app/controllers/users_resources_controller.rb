class UsersResourcesController < ApplicationController
  before_action :set_user_resource, only: %i[ show update destroy ]

  # GET /user_resources
  def index
    @user_resources = UserResource.all

    render json: @user_resources
  end

  # GET /user_resources/1
  def show
    render json: @user_resource
  end

  # POST /user_resources
  def create
    @user_resource = UserResource.new(user_resource_params)

    if @user_resource.save
      render json: @user_resource, status: :created, location: @user_resource
    else
      render json: @user_resource.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_resources/1
  def update
    if @user_resource.update(user_resource_params)
      render json: @user_resource
    else
      render json: @user_resource.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_resources/1
  def destroy
    @user_resource.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_resource
      @user_resource = UserResource.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_resource_params
      params.require(:user_resource).permit(:user_id, :resource_id)
    end
end
