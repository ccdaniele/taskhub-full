class ProjectsController < ApplicationController
  before_action :set_project, only: %i[ show update destroy ]

  # GET /projects
  def index
    @projects = Project.all
    render json: @projects
  end

  # GET /projects/1
  def show
    # Eager-load tasks and include them in the JSON response
    render json: @project.as_json(include: :tasks)
  end

  # POST /projects
  def create
    @project = Project.new(project_params)

    if @project.save
      render json: @project, status: :created, location: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /projects/1
  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  # DELETE /projects/1
  def destroy
    @project.destroy
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_project
      # Include associated tasks for performance and correctness
      @project = Project.includes(:tasks).find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def project_params
      params.require(:project).permit(:name, :time, :budget, :starting_at, :finish, :public, :projects)
    end
end
