class ResourceTagSerializer < ActiveModel::Serializer
  attributes :id, :resource_id, :tag_id, :created_at
end
