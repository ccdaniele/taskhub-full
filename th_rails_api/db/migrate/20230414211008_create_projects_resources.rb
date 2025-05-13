class CreateProjectsResources < ActiveRecord::Migration[7.0]
  def change
    create_table :projects_resources do |t|
      t.integer :project_id
      t.integer :resource_id

      t.timestamps
    end
  end
end
