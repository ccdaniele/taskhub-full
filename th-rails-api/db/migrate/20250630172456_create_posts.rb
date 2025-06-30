class CreatePosts < ActiveRecord::Migration[8.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.text :content
      t.string :post_type
      t.references :project, null: true, foreign_key: true
      t.references :task, null: true, foreign_key: true
      t.references :resource, null: true, foreign_key: true
      t.boolean :public

      t.timestamps
    end
  end
end
