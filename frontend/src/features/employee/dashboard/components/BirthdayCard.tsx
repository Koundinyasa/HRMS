import birthdayImage from "../../../../assets/images/birthday.png";

export default function BirthdayCard() {
  return (
    <div
      className="
        rounded-2xl
        p-5
        shadow-sm
        border
        h-full
      "
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-medium"
          style={{
            color: "var(--primary-color)",
          }}
        >
          Birthdays
        </h3>

        <button
          className="text-sm font-medium"
          style={{
            color: "var(--primary-color)",
          }}
        >
          View All
        </button>
      </div>

      {/* Divider */}

      <div
        className="h-[2px] mt-3"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />

      {/* Content */}

      <div className="flex flex-col items-center pt-8">
        <h4
          className="
            text-base
            font-medium
            text-slate-700
            text-center
          "
        >
          User Lorem Ipsum Birthday
        </h4>

        <p
          className="
            text-slate-600
            text-sm
            mt-10
          "
        >
          ● 23 June Birthday
        </p>

        {/* Wish Button */}

        <button
          className="
            mt-6
            w-full
            h-10
            rounded-lg
            text-white
            font-medium
            transition
          "
          style={{
            background: "var(--primary-gradient)",
          }}
        >
          Wish
        </button>

        {/* Birthday Image */}

        <div className="mt-8 flex justify-center">
          <img
            src={birthdayImage}
            alt="Birthday"
            className="
              w-52
              object-contain
            "
          />
        </div>
      </div>
    </div>
  );
}