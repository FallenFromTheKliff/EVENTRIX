import { useState, useEffect } from "react";
import { useBlocker } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { IconArrowLeft, IconCake, IconCalendarPlus, IconFileText, IconLock, IconMail, IconMapPin, IconPhone, IconTrash, IconUser } from "@tabler/icons-react";

import { useAuth } from "../../context/AuthContext";

import { buttonStyle, segmentStyle, profileSegments, nowLocal, removeStyle, pillStyle, toDate } from "../../utils/events";
import { genders, cities } from "../../data/details";

import Reveal from "../ui/Reveal";
import EventField from "../events/EventField";
import useLoadingText from "../ui/useLoadingText";
import ConfirmModal from "../ui/ConfirmModal";

import Placeholder from "../../assets/images/EVENTRIX-Placeholder.jpeg";

const colors = { USER: "bg-zinc-800", ADMIN: "bg-zinc-900" };
const lines = { USER: "border-zinc-900", ADMIN: "border-zinc-800" };
const genderStyle = "flex flex-1 items-center justify-center rounded-md py-3 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50";

const toFormValues = (profile) => ({
  name: profile?.name ?? "",
  phoneNumber: profile?.phoneNumber ?? "",
  profileImageUrl: profile?.profileImageUrl ?? "",
  bannerImageUrl: profile?.bannerImageUrl ?? "",
  gender: profile?.gender ?? "",
  city: profile?.city ?? "",
  birthday: profile?.birthday ?? "",
  about: profile?.about ?? "",
  privateProfile: profile?.privateProfile ?? false,
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

export default function ProfileEditor({ onExit }) {
  const { user, profile, updateProfile } = useAuth();
  const { loading, runner, texter } = useLoadingText();
  const photoUpload = useLoadingText(2000);
  const bannerUpload = useLoadingText(2000);
  const { register, handleSubmit, control, reset, setValue, formState: { isDirty, errors } } = useForm({
    defaultValues: toFormValues(profile)
  });
  const values = useWatch({ control });

  const [segment, setSegment] = useState(profileSegments[0]);
  const [message, setMessage] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const unsaved = isDirty && message?.type !== "success";
  const blocker = useBlocker(unsaved);

  useEffect(() => {
    if (profile) reset(toFormValues(profile));
  }, [profile, reset]);

  useEffect(() => {
    if (!unsaved) return;

    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);

  const handleError = (text) => setMessage({ type: "error", message: text });
  const handleBack = () => unsaved ? setDiscarding(true) : onExit();
  const handleDiscard = () => {
    reset(toFormValues(profile));
    setDiscarding(false);
    onExit();
  };
  const handleClose = () => {
    setMessage(null);
    if (message.type === "success" && user.role === "USER") onExit();
  };
  const handleInvalid = (invalid) => setSegment(invalid.name || invalid.phoneNumber ? "Introduction" : "Security");

  const onSubmission = (data) => runner(async () => {
    try {
      await updateProfile({
        ...data,
        confirmPassword: undefined,
        currentPassword: data.currentPassword || undefined,
        newPassword: data.newPassword || undefined
      });
      setMessage({ type: "success", message: "Profile updated!" });
    } catch (error) {
      setMessage({ type: "error", message: typeof error.response?.data === "string" ? error.response.data : "Failed to save changes!" });
    } finally {
      setConfirming(false);
    }
  });

  return (
    <>
      <section>
        <div className="flex border-b-4 border-zinc-900">
          <h2 className="flex items-center gap-3 -mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
            {user.role === "USER" ? (
              <>
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="flex items-center gap-3 transition duration-200 enabled:cursor-pointer enabled:hover:brightness-50"
                >
                  <IconArrowLeft size={32} />
                  <Reveal variant="type">My Profile</Reveal>
                </button>
                <span>/ <Reveal variant="type">Account Details</Reveal></span>
              </>
            ) : <Reveal variant="type">My Profile</Reveal>}
          </h2>
        </div>
      </section>
      <Reveal variant="lazy" className={`flex flex-col lg:flex-row ${colors[user.role]} min-h-180 overflow-hidden rounded-xl mt-8`}>
        <div className="flex items-center justify-center bg-linear-to-b from-cyan-500 to-blue-950 p-8 lg:w-2/5">
          <img src={values.profileImageUrl || Placeholder} alt="Profile Picture" className="size-128 rounded-full object-cover" />
        </div>
        <Reveal variant="right" className="relative flex flex-1 flex-col px-8 pt-8 pb-8">
          <div className={`flex gap-6 border-b-4 ${lines[user.role]}`}>
            {profileSegments.filter((label) => user.role === "USER" || label !== "Additional Details").map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setSegment(label)}
                disabled={loading}
                className={`${segmentStyle} ${label === segment ? "border-cyan-500 text-white" : "border-transparent text-gray-500"} enabled:cursor-pointer enabled:hover:brightness-50`}
              >
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit(() => setConfirming(true), handleInvalid)} noValidate className="mt-6 flex flex-1 flex-col">
            <fieldset disabled={loading} className="flex flex-1 min-w-0 flex-col">
              <div className="flex-1">
                <div className={segment === "Introduction" ? "space-y-4" : "hidden"}>
                  <EventField
                    label="Full Name:"
                    icon={IconUser}
                    placeholder="Enter your full name"
                    error={errors.name?.message}
                    {...register("name", { required: "Name is required!" })}
                  />
                  <EventField
                    type="email"
                    name="email"
                    label="Email:"
                    icon={IconMail}
                    hint="Your email cannot be changed."
                    className={pillStyle}
                    value={profile.email}
                    readOnly
                  />
                  <EventField
                    label="Contact No.:"
                    icon={IconPhone}
                    placeholder="Must be 11 digits"
                    maxLength={11}
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber", {
                      required: user.role === "USER" && "Phone number is required!",
                      pattern: { value: /^[0-9]{11}$/, message: "Phone number must be 11 digits!" },
                      onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, ""); }
                    })}
                  />
                  <EventField
                    name="createdAt"
                    label="Account Created:"
                    icon={IconCalendarPlus}
                    className={pillStyle}
                    value={toDate(profile.createdAt, "long")}
                    readOnly
                  />
                </div>
                <div className={segment === "Aesthetics" ? "space-y-4" : "hidden"}>
                  <EventField
                    type="photo"
                    label="Profile Picture:"
                    text={photoUpload.texter("UPLOAD PHOTO", "UPLOADING...")}
                    loading={photoUpload.loading}
                    hint="Recommended: 400 × 400 px, other sizes are cropped to fit."
                    width={400}
                    height={400}
                    onPick={([picture]) => photoUpload.runner(async () => setValue("profileImageUrl", picture, { shouldDirty: true }))}
                    onError={handleError}
                  >
                    {values.profileImageUrl && (
                      <button
                        type="button"
                        onClick={() => setValue("profileImageUrl", "", { shouldDirty: true })}
                        disabled={photoUpload.loading}
                        className={`${removeStyle} mt-2 ml-32`}
                      >
                        <IconTrash size={18} />
                        REMOVE PHOTO
                      </button>
                    )}
                  </EventField>
                  <EventField
                    type="photo"
                    label="Banner Picture:"
                    text={bannerUpload.texter("UPLOAD BANNER", "UPLOADING...")}
                    loading={bannerUpload.loading}
                    hint="Recommended: 1200 × 200 px (6:1), other sizes are cropped to fit."
                    width={1200}
                    height={200}
                    onPick={([picture]) => bannerUpload.runner(async () => setValue("bannerImageUrl", picture, { shouldDirty: true }))}
                    onError={handleError}
                  >
                    <div className="mt-2 ml-32 space-y-2">
                      <div className="bg-linear-to-r from-cyan-500 to-blue-950 h-24 overflow-hidden rounded-md">
                        {values.bannerImageUrl && <img src={values.bannerImageUrl} alt="Banner Picture" className="size-full object-contain" />}
                      </div>
                      {values.bannerImageUrl && (
                        <button
                          type="button"
                          onClick={() => setValue("bannerImageUrl", "", { shouldDirty: true })}
                          disabled={bannerUpload.loading}
                          className={removeStyle}
                        >
                          <IconTrash size={18} />
                          REMOVE BANNER
                        </button>
                      )}
                    </div>
                  </EventField>
                </div>
                {user.role === "USER" && (
                  <div className={segment === "Additional Details" ? "space-y-4" : "hidden"}>
                    <div className="flex items-center gap-4">
                      <p className="w-28 text-sm">Gender:</p>
                      <div className="flex flex-1 gap-3">
                        {genders.map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            type="button"
                            title={label}
                            onClick={() => setValue("gender", value, { shouldDirty: true })}
                            className={`${genderStyle} ${values.gender === value ? "bg-cyan-500 text-white" : "bg-white/15 text-gray-300"}`}
                          >
                            <Icon size={24} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <EventField type="date" label="Birthday:" icon={IconCake} max={nowLocal().slice(0, 10)} {...register("birthday")} />
                    <EventField
                      type="select"
                      label="Location:"
                      icon={IconMapPin}
                      all="No city"
                      options={cities}
                      value={values.city}
                      onSelect={(value) => setValue("city", value, { shouldDirty: true })}
                    />
                    <EventField
                      type="textarea"
                      label="About Me:"
                      icon={IconFileText}
                      placeholder="Tell us a little about yourself"
                      {...register("about")}
                    />
                  </div>
                )}
                <div className={segment === "Security" ? "space-y-4" : "hidden"}>
                  {user.role === "USER" && (
                    <>
                      <div>
                        <div className="flex items-center gap-4">
                          <p className="w-28 text-sm">Privacy:</p>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={values.privateProfile}
                            onClick={() => setValue("privateProfile", !values.privateProfile, { shouldDirty: true })}
                            className={`relative h-8 w-14 rounded-full transition duration-300 enabled:cursor-pointer enabled:hover:brightness-50 ${values.privateProfile ? "bg-cyan-500" : "bg-zinc-700"}`}
                          >
                            <span className={`absolute top-1 left-1 size-6 rounded-full bg-white transition duration-300 ${values.privateProfile ? "translate-x-6" : ""}`} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 pl-32">Hides your email, contact number, location, statistics and favorite events from public view.</p>
                      </div>
                      <div className="border-t border-zinc-700" />
                    </>
                  )}
                  <EventField
                    type="password"
                    label="Current Password:"
                    icon={IconLock}
                    autoComplete="current-password"
                    placeholder="Enter your current password"
                    error={errors.currentPassword?.message}
                    {...register("currentPassword", { required: Boolean(values.newPassword) && "Current password is required!" })}
                  />
                  <EventField
                    type="password"
                    label="New Password:"
                    icon={IconLock}
                    autoComplete="new-password"
                    placeholder="Must have at least 8 characters"
                    hint="Leave blank to keep your current password."
                    error={errors.newPassword?.message}
                    {...register("newPassword", { minLength: { value: 8, message: "Password must be at least 8 characters!" } })}
                  />
                  <EventField
                    type="password"
                    label="Confirm New Password:"
                    icon={IconLock}
                    autoComplete="new-password"
                    placeholder="Re-enter your new password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword", { validate: (value) => value === values.newPassword || "Passwords do not match!" })}
                  />
                </div>
              </div>
              <div className="flex pt-4">
                <button type="submit" disabled={!isDirty} className={`${buttonStyle} bg-green-500`}>
                  {texter("SAVE CHANGES", "SAVING")}
                </button>
              </div>
            </fieldset>
          </form>
        </Reveal>
      </Reveal>
      {message && <ConfirmModal type={message.type} message={message.message} onClose={handleClose} />}
      {confirming && (
        <ConfirmModal
          message="Save changes?"
          description="This will update your profile with your changes."
          confirmText={texter("SAVE", "SAVING")}
          loading={loading}
          onConfirm={handleSubmit(onSubmission)}
          onClose={() => setConfirming(false)}
        />
      )}
      {(discarding || blocker.state === "blocked") && (
        <ConfirmModal
          message="Discard changes?"
          description="Your unsaved changes will be lost."
          confirmText="DISCARD"
          onConfirm={discarding ? handleDiscard : blocker.proceed}
          onClose={discarding ? () => setDiscarding(false) : blocker.reset}
        />
      )}
    </>
  )
}