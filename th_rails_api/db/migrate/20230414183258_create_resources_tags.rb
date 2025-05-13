class CreateResourcesTags < ActiveRecord::Migration[7.0]
  def change
    create_table :resources_tags do |t|
      t.integer :resource_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
