class Resource < ApplicationRecord
    has_and_belongs_to_many :users
    has_and_belongs_to_many :projects
    has_and_belongs_to_many :tasks
    has_and_belongs_to_many :tags
end
