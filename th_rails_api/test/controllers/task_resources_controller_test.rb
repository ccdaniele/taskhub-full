require "test_helper"

class TaskResourcesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task_resource = task_resources(:one)
  end

  test "should get index" do
    get task_resources_url, as: :json
    assert_response :success
  end

  test "should create task_resource" do
    assert_difference("TaskResource.count") do
      post task_resources_url, params: { task_resource: { resource_id: @task_resource.resource_id, task_id: @task_resource.task_id } }, as: :json
    end

    assert_response :created
  end

  test "should show task_resource" do
    get task_resource_url(@task_resource), as: :json
    assert_response :success
  end

  test "should update task_resource" do
    patch task_resource_url(@task_resource), params: { task_resource: { resource_id: @task_resource.resource_id, task_id: @task_resource.task_id } }, as: :json
    assert_response :success
  end

  test "should destroy task_resource" do
    assert_difference("TaskResource.count", -1) do
      delete task_resource_url(@task_resource), as: :json
    end

    assert_response :no_content
  end
end
