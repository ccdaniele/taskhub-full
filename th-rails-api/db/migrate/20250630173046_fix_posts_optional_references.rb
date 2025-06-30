class FixPostsOptionalReferences < ActiveRecord::Migration[8.0]
  def change
    change_column_null :posts, :project_id, true
    change_column_null :posts, :task_id, true
    change_column_null :posts, :resource_id, true
  end
end
