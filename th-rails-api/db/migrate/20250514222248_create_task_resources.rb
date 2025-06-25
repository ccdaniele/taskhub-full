class CreateTaskResources < ActiveRecord::Migration[8.0]
  def change
    create_table :task_resources do |t|
      t.references :task, null: false, foreign_key: true
      t.references :resource, null: false, foreign_key: true

      t.timestamps
    end
  end
end
