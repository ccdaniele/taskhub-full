class Task < ApplicationRecord

    has_and_belongs_to_many :users
    has_many :projects_tasks, class_name: "ProjectsTask"
    has_many :projects, through: :projects_tasks
    has_and_belongs_to_many :resources
    has_and_belongs_to_many :tags

end
