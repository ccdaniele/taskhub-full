class CreateResources < ActiveRecord::Migration[7.0]
  def change
    create_table :resources do |t|
      t.string :name
      t.integer :price
      t.string :source
      t.string :status
      t.boolean :public

      t.timestamps
    end
  end
end
