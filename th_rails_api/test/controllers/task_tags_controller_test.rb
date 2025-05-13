require "test_helper"

class TaskTagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task_tag = task_tags(:one)
  end

  test "should get index" do
    get task_tags_url, as: :json
    assert_response :success
  end

  test "should create task_tag" do
    assert_difference("TaskTag.count") do
      post task_tags_url, params: { task_tag: { tag_id: @task_tag.tag_id, task_id: @task_tag.task_id } }, as: :json
    end

    assert_response :created
  end

  test "should show task_tag" do
    get task_tag_url(@task_tag), as: :json
    assert_response :success
  end

  test "should update task_tag" do
    patch task_tag_url(@task_tag), params: { task_tag: { tag_id: @task_tag.tag_id, task_id: @task_tag.task_id } }, as: :json
    assert_response :success
  end

  test "should destroy task_tag" do
    assert_difference("TaskTag.count", -1) do
      delete task_tag_url(@task_tag), as: :json
    end

    assert_response :no_content
  end
end
