class TasksTagsController < ApplicationController
  before_action :set_task_tag, only: %i[ show update destroy ]

  # GET /task_tags
  def index
    @task_tags = TaskTag.all

    render json: @task_tags
  end

  # GET /task_tags/1
  def show
    render json: @task_tag
  end

  # POST /task_tags
  def create
    @task_tag = TaskTag.new(task_tag_params)

    if @task_tag.save
      render json: @task_tag, status: :created, location: @task_tag
    else
      render json: @task_tag.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /task_tags/1
  def update
    if @task_tag.update(task_tag_params)
      render json: @task_tag
    else
      render json: @task_tag.errors, status: :unprocessable_entity
    end
  end

  # DELETE /task_tags/1
  def destroy
    @task_tag.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_task_tag
      @task_tag = TaskTag.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def task_tag_params
      params.require(:task_tag).permit(:task_id, :tag_id)
    end
end
