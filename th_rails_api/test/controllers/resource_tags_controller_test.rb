require "test_helper"

class ResourceTagsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @resource_tag = resource_tags(:one)
  end

  test "should get index" do
    get resource_tags_url, as: :json
    assert_response :success
  end

  test "should create resource_tag" do
    assert_difference("ResourceTag.count") do
      post resource_tags_url, params: { resource_tag: { resource_id: @resource_tag.resource_id, tag_id: @resource_tag.tag_id } }, as: :json
    end

    assert_response :created
  end

  test "should show resource_tag" do
    get resource_tag_url(@resource_tag), as: :json
    assert_response :success
  end

  test "should update resource_tag" do
    patch resource_tag_url(@resource_tag), params: { resource_tag: { resource_id: @resource_tag.resource_id, tag_id: @resource_tag.tag_id } }, as: :json
    assert_response :success
  end

  test "should destroy resource_tag" do
    assert_difference("ResourceTag.count", -1) do
      delete resource_tag_url(@resource_tag), as: :json
    end

    assert_response :no_content
  end
end
