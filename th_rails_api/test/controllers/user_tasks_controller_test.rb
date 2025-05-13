require "test_helper"

class UserTasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_task = user_tasks(:one)
  end

  test "should get index" do
    get user_tasks_url, as: :json
    assert_response :success
  end

  test "should create user_task" do
    assert_difference("UserTask.count") do
      post user_tasks_url, params: { user_task: { task_id: @user_task.task_id, user_id: @user_task.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show user_task" do
    get user_task_url(@user_task), as: :json
    assert_response :success
  end

  test "should update user_task" do
    patch user_task_url(@user_task), params: { user_task: { task_id: @user_task.task_id, user_id: @user_task.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy user_task" do
    assert_difference("UserTask.count", -1) do
      delete user_task_url(@user_task), as: :json
    end

    assert_response :no_content
  end
end
