class CreateProjectResources < ActiveRecord::Migration[8.0]
  def change
    create_table :project_resources do |t|
      t.references :project, null: false, foreign_key: true
      t.references :resource, null: false, foreign_key: true

      t.timestamps
    end
  end
end
