class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags do |t|
      t.string :name
      t.boolean :public
      t.text :description

      t.timestamps
    end
  end
end
