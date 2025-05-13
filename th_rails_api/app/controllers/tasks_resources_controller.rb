class TasksResourcesController < ApplicationController
  before_action :set_task_resource, only: %i[ show update destroy ]

  # GET /task_resources
  def index
    @task_resources = TaskResource.all

    render json: @task_resources
  end

  # GET /task_resources/1
  def show
    render json: @task_resource
  end

  # POST /task_resources
  def create
    @task_resource = TaskResource.new(task_resource_params)

    if @task_resource.save
      render json: @task_resource, status: :created, location: @task_resource
    else
      render json: @task_resource.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /task_resources/1
  def update
    if @task_resource.update(task_resource_params)
      render json: @task_resource
    else
      render json: @task_resource.errors, status: :unprocessable_entity
    end
  end

  # DELETE /task_resources/1
  def destroy
    @task_resource.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task_resource
      @task_resource = TaskResource.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def task_resource_params
      params.require(:task_resource).permit(:task_id, :resource_id)
    end
end
