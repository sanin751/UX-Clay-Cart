import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/ui/FormField';
import getErrorMessage from '../../utils/getErrorMessage';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import * as addressService from '../../services/addressService';

const profileSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'At least 8 characters long')
    .matches(/\d/, 'Must include a number')
    .required('New password is required'),
});

const MAX_PASSWORD_ATTEMPTS = 2;

function ChangePasswordForm() {
  const { user } = useAuth();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [resetSending, setResetSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(changePasswordSchema) });

  async function onSubmit(values) {
    try {
      await authService.changePassword(values.currentPassword, values.newPassword);
      toast.success('Password changed successfully');
      reset();
      setFailedAttempts(0);
    } catch (err) {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      if (nextAttempts >= MAX_PASSWORD_ATTEMPTS) {
        setLocked(true);
      } else {
        toast.error(getErrorMessage(err, 'Current password is incorrect'));
      }
    }
  }

  async function handleSendResetLink() {
    setResetSending(true);
    try {
      await authService.forgotPassword(user.email);
      toast.success('Password reset link sent to your email');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResetSending(false);
    }
  }

  function handleTryAgain() {
    setLocked(false);
    setFailedAttempts(0);
    reset();
  }

  if (locked) {
    return (
      <div className="mt-4 rounded-xl bg-cream-100 p-4">
        <p className="font-semibold text-ink-800">Too many incorrect attempts</p>
        <p className="mt-1 text-sm text-ink-600">
          We couldn&apos;t verify your current password. Send a reset link to your email instead, or try again.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button size="sm" onClick={handleSendResetLink} disabled={resetSending}>
            {resetSending ? 'Sending...' : 'Send Password Reset Link'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleTryAgain}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Current Password" htmlFor="currentPassword" error={errors.currentPassword?.message}>
          <Input id="currentPassword" type="password" {...register('currentPassword')} />
        </FormField>
        <FormField label="New Password" htmlFor="newPassword" error={errors.newPassword?.message}>
          <Input id="newPassword" type="password" {...register('newPassword')} />
        </FormField>
      </div>
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}

const addressSchema = yup.object({
  fullName: yup.string().trim().required('Required'),
  phone: yup.string().trim().required('Required'),
  street: yup.string().trim().required('Required'),
  city: yup.string().trim().required('Required'),
  state: yup.string().trim(),
  postalCode: yup.string().trim(),
  country: yup.string().trim().required('Required'),
});

function AddressForm({ onSaved, onCancel, initial }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(addressSchema), defaultValues: initial || { country: 'Nepal' } });

  async function onSubmit(values) {
    try {
      const saved = initial
        ? await addressService.updateAddress(initial._id, values)
        : await addressService.createAddress(values);
      toast.success('Address saved');
      onSaved(saved);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-3 rounded-xl bg-cream-100 p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField error={errors.fullName?.message}>
          <Input placeholder="Full name" {...register('fullName')} />
        </FormField>
        <FormField error={errors.phone?.message}>
          <Input placeholder="Phone" {...register('phone')} />
        </FormField>
      </div>
      <FormField error={errors.street?.message}>
        <Input placeholder="Street address" {...register('street')} />
      </FormField>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <FormField error={errors.city?.message}>
          <Input placeholder="City" {...register('city')} />
        </FormField>
        <FormField>
          <Input placeholder="State (optional)" {...register('state')} />
        </FormField>
        <FormField>
          <Input placeholder="Postal code" {...register('postalCode')} />
        </FormField>
      </div>
      <FormField error={errors.country?.message}>
        <Input placeholder="Country" {...register('country')} />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input type="checkbox" {...register('isDefault')} className="h-4 w-4 rounded border-ink-200 text-clay-500" />
        Set as default address
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          Save Address
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AccountSettings() {
  const { user, setUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(profileSchema), defaultValues: { name: user?.name } });

  useEffect(() => {
    reset({ name: user?.name });
  }, [user, reset]);

  useEffect(() => {
    addressService.getAddresses().then(setAddresses);
  }, []);

  async function onSaveProfile(values) {
    try {
      const updated = await authService.updateProfile(values);
      setUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleDeleteAddress(id) {
    try {
      await addressService.deleteAddress(id);
      setAddresses((list) => list.filter((a) => a._id !== id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100/60">
        <h2 className="text-xl font-bold text-ink-900">Personal Information</h2>
        <form onSubmit={handleSubmit(onSaveProfile)} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Full Name" htmlFor="profile-name" error={errors.name?.message}>
            <Input id="profile-name" {...register('name')} />
          </FormField>
          <FormField label="Email Address" htmlFor="profile-email">
            <Input id="profile-email" value={user?.email || ''} disabled className="opacity-60" />
          </FormField>
          <Button type="submit" size="sm" className="w-fit" disabled={isSubmitting}>
            Save Changes
          </Button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100/60">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink-900">Saved Addresses</h2>
          {!addingNew && (
            <button
              onClick={() => setAddingNew(true)}
              className="text-sm font-semibold text-clay-600 hover:underline"
            >
              + Add New
            </button>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) =>
            editingId === address._id ? (
              <AddressForm
                key={address._id}
                initial={address}
                onCancel={() => setEditingId(null)}
                onSaved={(saved) => {
                  setAddresses((list) => list.map((a) => (a._id === saved._id ? saved : a)));
                  setEditingId(null);
                }}
              />
            ) : (
              <div key={address._id} className="rounded-xl bg-cream-100 p-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink-800">{address.fullName}</p>
                  {address.isDefault && (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-ink-600">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {address.street}, {address.city}
                  {address.state ? `, ${address.state}` : ''}
                </p>
                <p className="text-sm text-ink-600">{address.country}</p>
                <div className="mt-3 flex gap-4 text-sm">
                  <button onClick={() => setEditingId(address._id)} className="font-medium text-clay-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAddress(address._id)} className="font-medium text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {addingNew && (
          <AddressForm
            onCancel={() => setAddingNew(false)}
            onSaved={(saved) => {
              setAddresses((list) => [...list, saved]);
              setAddingNew(false);
            }}
          />
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink-100/60">
        <h2 className="text-xl font-bold text-ink-900">Security &amp; Privacy</h2>
        <p className="mt-1 text-sm text-ink-600">Update your password using your current password.</p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
