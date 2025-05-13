class CreateProjectsTags < ActiveRecord::Migration[7.0]
  def change
    create_table :projects_tags do |t|
      t.integer :project_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
