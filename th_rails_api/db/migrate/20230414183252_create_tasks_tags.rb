class CreateTasksTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks_tags do |t|
      t.integer :task_id
      t.integer :tag_id
      t.boolean :public
      

      t.timestamps
    end
  end
end
