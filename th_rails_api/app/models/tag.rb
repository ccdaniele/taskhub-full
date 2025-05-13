class Tag < ApplicationRecord

    has_and_belongs_to_many :projects
    has_and_belongs_to_many :tasks
    has_and_belongs_to_many :resources
end
