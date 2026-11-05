import { useState, useEffect } from "react";
import { IconArchive, IconBroadcast, IconCalendarEvent, IconCalendarPlus, IconFileText, IconLock, IconMail, IconMapPin, IconPencil, IconPhone, IconStarFilled, IconTag, IconTicket } from "@tabler/icons-react";

import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventContext";

import { messageStyle, tagStyle, pillStyle, iconStyle, lockedStyle, toDate } from "../utils/events";
import { statusBadges } from "../data/statcheck";

import Reveal from "../components/ui/Reveal";
import StatCard from "../components/ui/StatCard";
import PictureSlider from "../components/events/PictureSlider";
import EventField from "../components/events/EventField";
import ProfileEditor from "../components/auth/ProfileEditor";

import Placeholder from "../assets/images/EVENTRIX-Placeholder.jpeg";

const badgeStyle = "flex w-fit items-center gap-2 rounded-full px-3 py-1 text-sm";

export default function Profile() {
  const { user, profile, getStats } = useAuth();
  const { getFavorites } = useEvents();

  const [mode, setMode] = useState(user.role === "ADMIN" ? "details" : "display");
  const [stats, setStats] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [slide, setSlide] = useState(0);
  const [error, setError] = useState("");

  const event = favorites[slide];

  useEffect(() => {
    if (user.role !== "USER") return;

    let active = true;

    Promise.all([getStats(), getFavorites()])
      .then(([statsData, favoritesData]) => {
        if (active) {
          setStats(statsData);
          setFavorites(favoritesData);
        }
      })
      .catch(() => {
        if (active) setError("Sorry, we couldn't load your profile... Try refreshing the page!");
      });

    return () => {
      active = false;
    };
  }, [user.role, getStats, getFavorites]);

  return (
    <div className="flex flex-1 flex-col">
      {profile && <title>{`${profile.name} - EVENTRIX`}</title>}
      {error ? (
        <p className={messageStyle}>{error}</p>
      ) : !profile || (user.role === "USER" && !stats) ? (
        <p className={messageStyle}>Loading profile...</p>
      ) : mode === "display" ? (
        <div className="space-y-8">
          <div className="bg-zinc-800 overflow-hidden rounded-xl">
            <Reveal variant="reappear" className="aspect-4/1 bg-linear-to-r from-cyan-500 to-blue-950">
              {profile.bannerImageUrl && <img src={profile.bannerImageUrl} alt="Banner" className="size-full object-cover" />}
            </Reveal>
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 px-8 pb-5">
              <Reveal variant="reappear" className="relative -mt-18">
                <img
                  src={profile.profileImageUrl || Placeholder}
                  alt={profile.name}
                  className="block size-48 rounded-full object-cover ring-8 ring-zinc-800"
                />
              </Reveal>
              <button
                type="button"
                onClick={() => setMode("details")}
                className="flex items-center gap-2 justify-self-end bg-cyan-500 font-bold rounded-md px-6 py-3 cursor-pointer transition duration-200 hover:brightness-50"
              >
                <IconPencil size={20} />
                EDIT PROFILE
              </button>
              <div className="col-span-2 space-y-3">
                <h3 className="text-4xl font-bold">
                  <Reveal variant="type">{profile.name}</Reveal>
                </h3>
                {profile.privateProfile ? (
                  <p className="flex items-center gap-2">
                    <IconLock size={18} className="shrink-0" />
                    <Reveal variant="type">This person has decided to hide their details from public view.</Reveal>
                  </p>
                ) : (
                  <div className="-ml-0.5 flex flex-col gap-2 text-base text-gray-400 xl:flex-row xl:gap-4">
                    <p className="flex items-center gap-2">
                      <IconMail size={18} className="shrink-0" />
                      <Reveal variant="type">{profile.email}</Reveal>
                    </p>
                    <p className="flex items-center gap-2">
                      <IconPhone size={18} className="shrink-0" />
                      <Reveal variant="type">{profile.phoneNumber || "No contact number added"}</Reveal>
                    </p>
                    <p className="flex items-center gap-2">
                      <IconMapPin size={18} className="shrink-0" />
                      <Reveal variant="type">{profile.city || "No location added"}</Reveal>
                    </p>
                  </div>
                )}
              </div>
            </div>
            {!profile.privateProfile && (
              <>
                <div className="mx-8 border-t border-zinc-700" />
                <div className="grid gap-6 px-8 py-6 xl:grid-cols-3">
                  <Reveal variant="reappear" className="h-full">
                    <StatCard icon={IconTicket} label="Total Bookings Made" value={stats.totalBookings} />
                  </Reveal>
                  <Reveal variant="reappear" className="h-full">
                    <StatCard icon={IconCalendarPlus} label="Member Since" value={toDate(stats.joinedAt, "long")} />
                  </Reveal>
                  <Reveal variant="reappear" className="h-full">
                    <StatCard icon={IconStarFilled} label="Average Stars from Reviews" value={stats.averageStars.toFixed(1)} />
                  </Reveal>
                </div>
              </>
            )}
          </div>
          <section>
            <div className="flex border-b-4 border-zinc-900">
              <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
                <Reveal variant="type">About</Reveal>
              </h2>
            </div>
            <Reveal variant="lazy" className="mt-8 bg-zinc-800 overflow-hidden rounded-xl">
              {profile.about ? (
                <p className="p-8 text-gray-300 whitespace-pre-line">{profile.about}</p>
              ) : (
                <p className="p-8 text-center text-gray-400">This person has not written anything yet...</p>
              )}
            </Reveal>
          </section>
          <section>
            <div className="flex border-b-4 border-zinc-900">
              <h2 className="-mb-1 border-b-4 border-cyan-500 pb-3 text-3xl font-bold">
                <Reveal variant="type">Favorite Events</Reveal>
              </h2>
            </div>
            <Reveal variant="lazy" className="mt-8 flex flex-col lg:flex-row bg-zinc-800 min-h-180 overflow-hidden rounded-xl">
              {profile.privateProfile ? (
                <p className="m-auto p-8 text-center text-gray-400">This person has decided to hide their favorite events from public view.</p>
              ) : event ? (
                <>
                  <div className="relative min-h-112 overflow-hidden lg:w-1/2">
                    <PictureSlider
                      images={favorites.map(({ thumbnailUrl }) => thumbnailUrl || Placeholder)}
                      index={slide}
                      alt={event.title}
                      onChange={setSlide}
                    />
                  </div>
                  <Reveal variant="right" className="relative flex flex-1 flex-col gap-4 p-8">
                    <h3 className="text-3xl font-bold">{event.title}</h3>
                    <div className="flex flex-wrap gap-3">
                      {event.category && <p className={tagStyle}><IconTag size={18} />{event.category}</p>}
                      <p className={`${badgeStyle} ${statusBadges[event.status].color}`}>
                        {event.status === "ACTIVE" ? <IconBroadcast size={18} /> : <IconArchive size={18} />}
                        {statusBadges[event.status].label}
                      </p>
                    </div>
                    <EventField type="textarea" name="description" label="Description:" icon={IconFileText} className={lockedStyle} value={event.description ?? ""} readOnly />
                    <p className="-mb-3 text-sm">Additional Details:</p>
                    <p className={pillStyle}>
                      <IconCalendarEvent size={20} className={iconStyle} />
                      {toDate(event.dateTime)}
                    </p>
                    <p className={pillStyle}>
                      <IconMapPin size={20} className={iconStyle} />
                      {event.location}
                    </p>
                  </Reveal>
                </>
              ) : (
                <p className="m-auto p-8 text-center text-gray-400">This person has not favorited any events yet...</p>
              )}
            </Reveal>
          </section>
        </div>
      ) : (
        <ProfileEditor onExit={() => setMode("display")} />
      )}
    </div>
  )
}