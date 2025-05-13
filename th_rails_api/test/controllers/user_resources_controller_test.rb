require "test_helper"

class UserResourcesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_resource = user_resources(:one)
  end

  test "should get index" do
    get user_resources_url, as: :json
    assert_response :success
  end

  test "should create user_resource" do
    assert_difference("UserResource.count") do
      post user_resources_url, params: { user_resource: { resource_id: @user_resource.resource_id, user_id: @user_resource.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show user_resource" do
    get user_resource_url(@user_resource), as: :json
    assert_response :success
  end

  test "should update user_resource" do
    patch user_resource_url(@user_resource), params: { user_resource: { resource_id: @user_resource.resource_id, user_id: @user_resource.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy user_resource" do
    assert_difference("UserResource.count", -1) do
      delete user_resource_url(@user_resource), as: :json
    end

    assert_response :no_content
  end
end
