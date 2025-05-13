class UsersTasksController < ApplicationController
  before_action :set_user_task, only: %i[ show update destroy ]

  # GET /user_tasks
  def index
    @user_tasks = UserTask.all

    render json: @user_tasks
  end

  # GET /user_tasks/1
  def show
    render json: @user_task
  end

  # POST /user_tasks
  def create
    @user_task = UserTask.new(user_task_params)

    if @user_task.save
      render json: @user_task, status: :created, location: @user_task
    else
      render json: @user_task.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_tasks/1
  def update
    if @user_task.update(user_task_params)
      render json: @user_task
    else
      render json: @user_task.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_tasks/1
  def destroy
    @user_task.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_task
      @user_task = UserTask.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_task_params
      params.require(:user_task).permit(:user_id, :task_id)
    end
end
