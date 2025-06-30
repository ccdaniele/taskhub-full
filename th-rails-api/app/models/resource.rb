class Resource < ApplicationRecord
    has_many :user_resources
    has_many :users, through: :user_resources

    has_many :project_resources
    has_many :projects, through: :project_resources

    has_many :task_resources
    has_many :tasks, through: :task_resources

    has_many :resource_tags
    has_many :tags, through: :resource_tags
end
