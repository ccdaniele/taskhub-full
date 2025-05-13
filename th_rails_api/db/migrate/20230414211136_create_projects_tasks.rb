class CreateProjectsTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :projects_tasks do |t|
      t.integer :project_id
      t.integer :task_id

      t.timestamps
    end
  end
end
