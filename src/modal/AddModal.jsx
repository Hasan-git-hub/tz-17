import UserFormModal from "./UserFormModal";

const AddModal = ({ onAdd, onClose, isSubmitting }) => (
  <UserFormModal
    title="Add new user"
    description="Yangi foydalanuvchi ma'lumotlarini kiriting va ro'yxatni bir zumda yangilang."
    submitLabel="Add User"
    initialValues={{
      name: "",
      username: "",
      email: "",
    }}
    onSubmit={onAdd}
    onClose={onClose}
    isSubmitting={isSubmitting}
  />
);

export default AddModal;
