class ProjectTasksController < ApplicationController
  def create
    project_task = ProjectTask.new(project_task_params)

    if project_task.save
      render json: project_task, status: :created
    else
      render json: project_task.errors, status: :unprocessable_entity
    end
  end

  private

  def project_task_params
    params.require(:project_task).permit(:project_id, :task_id)
  end
end
