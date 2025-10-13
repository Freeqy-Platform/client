import { ChevronDownIcon } from "@heroicons/react/16/solid";

export default function Contact() {
  return (
    <div className="bg-primary/10 px-6 py-4 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          Contact Us
        </h2>
        <p className="mt-2 text-lg/8 text-muted-foreground">
          Get in touch with us for any questions or support.
        </p>
      </div>
      <form action="#" method="POST" className="mx-auto mt-8 max-w-xl sm:mt-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm/6 font-semibold text-foreground"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                id="first-name"
                name="first-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-ring focus:border-ring"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm/6 font-semibold text-foreground"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                id="last-name"
                name="last-name"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-ring focus:border-ring"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-foreground"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-ring focus:border-ring"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm/6 font-semibold text-foreground"
            >
              Phone number
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-background border border-input has-[input:focus-within]:outline-2 has-[input:focus-within]:outline-ring has-[input:focus-within]:border-ring">
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country"
                    aria-label="Country"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-transparent py-2 pr-7 pl-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-sm/6"
                  >
                    <option>EGY</option>
                    <option>KSA</option>
                    <option>UAE</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-muted-foreground sm:size-4"
                  />
                </div>
                <input
                  id="phone-number"
                  name="phone-number"
                  type="text"
                  placeholder="123-456-7890"
                  className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm/6 font-semibold text-foreground"
            >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                id="message"
                name="message"
                rows={4}
                className="block w-full rounded-md bg-background border border-input px-3.5 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-ring focus:border-ring"
                defaultValue={""}
              />
            </div>
          </div>
          <div className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <div className="group relative inline-flex w-8 shrink-0 rounded-full bg-secondary p-px border border-input transition-colors duration-200 ease-in-out has-checked:bg-primary has-focus-visible:outline-2 has-focus-visible:outline-ring">
                <span className="size-4 rounded-full bg-background shadow-xs border border-input transition-transform duration-200 ease-in-out group-has-checked:translate-x-3.5" />
                <input
                  id="agree-to-policies"
                  name="agree-to-policies"
                  type="checkbox"
                  aria-label="Agree to policies"
                  className="absolute inset-0 appearance-none focus:outline-hidden"
                />
              </div>
            </div>
            <label
              htmlFor="agree-to-policies"
              className="text-sm/6 text-muted-foreground"
            >
              By selecting this, you agree to our{" "}
              <a
                href="#"
                className="font-semibold whitespace-nowrap text-primary hover:text-primary/80"
              >
                privacy policy
              </a>
              .
            </label>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}
