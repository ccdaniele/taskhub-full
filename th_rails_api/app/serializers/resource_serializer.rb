class ResourceSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :source, :status
end
