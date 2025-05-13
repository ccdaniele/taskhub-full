class ResourcesTagsController < ApplicationController
  before_action :set_resource_tag, only: %i[ show update destroy ]

  # GET /resource_tags
  def index
    @resource_tags = ResourceTag.all

    render json: @resource_tags
  end

  # GET /resource_tags/1
  def show
    render json: @resource_tag
  end

  # POST /resource_tags
  def create
    @resource_tag = ResourceTag.new(resource_tag_params)

    if @resource_tag.save
      render json: @resource_tag, status: :created, location: @resource_tag
    else
      render json: @resource_tag.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /resource_tags/1
  def update
    if @resource_tag.update(resource_tag_params)
      render json: @resource_tag
    else
      render json: @resource_tag.errors, status: :unprocessable_entity
    end
  end

  # DELETE /resource_tags/1
  def destroy
    @resource_tag.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_resource_tag
      @resource_tag = ResourceTag.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def resource_tag_params
      params.require(:resource_tag).permit(:resource_id, :tag_id)
    end
end
