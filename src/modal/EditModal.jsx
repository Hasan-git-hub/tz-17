import UserFormModal from "./UserFormModal";

const EditModal = ({ user, onEdit, onClose, isSubmitting }) => (
  <UserFormModal
    title="Edit user"
    description="Foydalanuvchi ma'lumotlarini yangilang va o'zgarishlarni darhol saqlang."
    submitLabel="Save Changes"
    initialValues={{
      name: user?.name ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
    }}
    onSubmit={onEdit}
    onClose={onClose}
    isSubmitting={isSubmitting}
  />
);

export default EditModal;
