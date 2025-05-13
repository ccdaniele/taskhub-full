class CreateTasksResources < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks_resources do |t|
      t.integer :task_id
      t.integer :resource_id

      t.timestamps
    end
  end
end
