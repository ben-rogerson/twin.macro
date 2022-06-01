import { globalStyles } from './macro'

globalStyles
;() => (
  <>
    <div tw="p-5 m-5">
      <div tw="p-5 m-5">
        <button tw="btn btn-outline">Button</button>
        <button tw="btn btn-outline btn-primary">Button</button>
        <button tw="btn btn-outline btn-secondary">Button</button>
        <button tw="btn btn-outline btn-accent">Button</button>
      </div>
      <div tw="p-5 m-5">
        <div tw="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              tw="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Task failed successfully.</span>
          </div>
        </div>

        <div tw="alert shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              tw="stroke-info flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>12 unread messages. Tap to see.</span>
          </div>
        </div>
      </div>

      <div tw="p-5 m-5">
        <label htmlFor="my-modal" tw="btn" className="modal-button">
          open modal
        </label>
      </div>
      <div tw="p-5 m-5">
        <label tw="swap" className="swap">
          <input type="checkbox" />
          <div tw="swap-on">ON</div>
          <div tw="swap-off">OFF</div>
        </label>
      </div>
      <div tw="p-5 m-5">
        <div tw="badge badge-info gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            tw="inline-block w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          info
        </div>
        <div tw="badge badge-success gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            tw="inline-block w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          success
        </div>
        <div tw="badge badge-warning gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            tw="inline-block w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          warning
        </div>
        <div tw="badge badge-error gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            tw="inline-block w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          error
        </div>
      </div>
      <div tw="p-5 m-5">
        <span tw="countdown">
          <span
            css={{
              '--value': '25',
            }}
          ></span>
        </span>
      </div>
      <div tw="p-5 m-5">
        <div tw="stats shadow">
          <div tw="stat">
            <div tw="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                tw="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div tw="stat-title">Total Likes</div>
            <div tw="stat-value text-primary">25.6K</div>
            <div tw="stat-desc">21% more than last month</div>
          </div>

          <div tw="stat">
            <div tw="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                tw="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div tw="stat-title">Page Views</div>
            <div tw="stat-value text-secondary">2.6M</div>
            <div tw="stat-desc">21% more than last month</div>
          </div>

          <div tw="stat">
            <div tw="stat-figure text-secondary">
              <div tw="avatar" className="online">
                <div tw="w-16 rounded-full">
                  <img src="https://api.lorem.space/image/face?w=128&h=128" />
                </div>
              </div>
            </div>
            <div tw="stat-value">86%</div>
            <div tw="stat-title">Tasks done</div>
            <div tw="stat-desc text-secondary">31 tasks remaining</div>
          </div>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="card card-side bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://api.lorem.space/image/movie?w=200&h=280"
              alt="Movie"
            />
          </figure>
          <div tw="card-body">
            <h2 tw="card-title">New movie is released!</h2>
            <p>Click the button to watch on Jetflix app.</p>
            <div tw="card-actions justify-end">
              <button tw="btn btn-primary">Watch</button>
            </div>
          </div>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div className="tooltip" tw="tooltip" data-tip="hello">
          <button tw="btn">Bottom</button>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="form-control">
          <label tw="label cursor-pointer">
            <span tw="label-text">Remember me</span>
            <input type="checkbox" tw="checkbox checkbox-primary" />
          </label>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="form-control w-full max-w-xs">
          <label tw="label">
            <span tw="label-text">What is your name?</span>
            <span tw="label-text-alt">Alt label</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            tw="input input-bordered input-secondary w-full max-w-xs"
          />
          <label tw="label">
            <span tw="label-text-alt">Alt label</span>
            <span tw="label-text-alt">Alt label</span>
          </label>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="form-control">
          <label tw="label cursor-pointer">
            <span tw="label-text">Red pill</span>
            <input
              type="radio"
              name="radio-6"
              tw="radio checked:bg-red-500"
              // checked
            />
          </label>
        </div>
        <div tw="form-control">
          <label tw="label cursor-pointer">
            <span tw="label-text">blue pill</span>
            <input
              type="radio"
              name="radio-6"
              tw="radio checked:bg-blue-500"
              // checked
            />
          </label>
        </div>
      </div>
      <div tw="p-5 m-5">
        <input type="range" min="0" max="100" tw="range range-secondary" />
      </div>
      <div tw="p-5 m-5">
        <div tw="rating gap-1">
          <input type="radio" name="rating-3" tw="mask mask-heart bg-red-400" />
          <input
            type="radio"
            name="rating-3"
            tw="mask mask-heart bg-orange-400"
          />
          <input
            type="radio"
            name="rating-3"
            tw="mask mask-heart bg-yellow-400"
          />
          <input
            type="radio"
            name="rating-3"
            tw="mask mask-heart bg-lime-400"
          />
          <input
            type="radio"
            name="rating-3"
            tw="mask mask-heart bg-green-400"
          />
        </div>
      </div>
      <div tw="p-5 m-5">
        <select tw="select select-success w-full max-w-xs">
          <option disabled>Pick your favorite anime</option>
          <option>One Piece</option>
          <option>Naruto</option>
          <option>Death Note</option>
          <option>Attack on Titan</option>
          <option>Bleach</option>
          <option>Fullmetal Alchemist</option>
          <option>Jojo's Bizarre Adventure</option>
        </select>
      </div>
      <div tw="p-5 m-5">
        <input type="checkbox" tw="toggle" />
      </div>
      <div tw="p-5 m-5">
        <div tw="btn-group">
          <input
            type="radio"
            name="options"
            data-title="1"
            tw="btn"
            className="btn"
          />
          <input
            type="radio"
            name="options"
            data-title="2"
            tw="btn"
            className="btn"
          />
          <input
            type="radio"
            name="options"
            data-title="3"
            tw="btn"
            className="btn"
          />
          <input
            type="radio"
            name="options"
            data-title="4"
            tw="btn"
            className="btn"
          />
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="drawer" className="drawer">
          <input id="my-drawer" type="checkbox" tw="drawer-toggle" />
          <div tw="drawer-content" className="drawer-content">
            <label htmlFor="my-drawer" tw="btn btn-primary drawer-button">
              Open drawer
            </label>
          </div>
          <div tw="drawer-side" className="drawer-side">
            <label
              htmlFor="my-drawer"
              tw="drawer-overlay"
              className="drawer-overlay"
            ></label>
            <ul
              className="menu"
              tw="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content"
            >
              <li>
                <a>Sidebar Item 1</a>
              </li>
              <li>
                <a>Sidebar Item 2</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="hero min-h-screen bg-base-200">
          <div tw="hero-content text-center">
            <div tw="max-w-md">
              <h1 tw="text-5xl font-bold">Hello there</h1>
              <p tw="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <button tw="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="indicator" className="indicator">
          <span
            tw="indicator-item badge badge-secondary"
            className="indicator-item"
          >
            99+
          </span>
          <button tw="btn">inbox</button>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="text-sm breadcrumbs">
          <ul>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  tw="w-4 h-4 mr-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                Home
              </a>
            </li>
            <li>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  tw="w-4 h-4 mr-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                Documents
              </a>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                tw="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Add Document
            </li>
          </ul>
        </div>
      </div>
      <div tw="p-5 m-5">
        <ul tw="steps" className="steps">
          <li className="step step-primary" tw=" step-primary">
            Register
          </li>
          <li className="step step-primary" tw=" step-primary">
            Choose plan
          </li>
          <li className="step  step-primary" tw=" step-primary">
            Purchase
          </li>
          <li className="step" tw="">
            Receive Product
          </li>
        </ul>
      </div>
      <div tw="p-5 m-5">
        <ul tw="steps" className="steps">
          <li className="step step-info" tw="step step-info">
            Fly to moon
          </li>
          <li className="step step-info" tw="step step-info">
            Shrink the moon
          </li>
          <li className="step step-info" tw="step step-info">
            Grab the moon
          </li>
          <li className="step step-error" tw="step step-error" data-content="?">
            Sit on toilet
          </li>
        </ul>
      </div>
      <div tw="p-5 m-5">
        <div tw="tabs">
          <a tw="tab tab-lg tab-lifted">Tab 1</a>
          <a tw="tab tab-lg tab-lifted" className=" tab-active">
            Tab 2
          </a>
          <a tw="tab tab-lg tab-lifted">Tab 3</a>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="mockup-code">
          <pre data-prefix="$">
            <code>npm i daisyui</code>
          </pre>
          <pre data-prefix=">" tw="text-warning">
            <code>installing...</code>
          </pre>
          <pre data-prefix=">" tw="text-success">
            <code>Done!</code>
          </pre>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="card w-96 bg-base-100 shadow-xl">
          <figure>
            <img
              src="https://api.lorem.space/image/shoes?w=400&h=225"
              alt="Shoes"
            />
          </figure>
          <div tw="card-body">
            <h2 tw="card-title">Shoes!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div tw="card-actions justify-end">
              <button tw="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
      <div tw="p-5 m-5 gap-2 grid">
        <div tw="carousel w-full">
          <div id="item1" tw="carousel-item w-full">
            <img
              src="https://api.lorem.space/image/car?w=800&h=200&hash=8B7BCDC2"
              tw="w-full"
            />
          </div>
          <div id="item2" tw="carousel-item w-full">
            <img
              src="https://api.lorem.space/image/car?w=800&h=200&hash=500B67FB"
              tw="w-full"
            />
          </div>
          <div id="item3" tw="carousel-item w-full">
            <img
              src="https://api.lorem.space/image/car?w=800&h=200&hash=A89D0DE6"
              tw="w-full"
            />
          </div>
          <div id="item4" tw="carousel-item w-full">
            <img
              src="https://api.lorem.space/image/car?w=800&h=200&hash=225E6693"
              tw="w-full"
            />
          </div>
        </div>
        <div tw="flex justify-center w-full py-2 gap-2">
          <a href="#item1" tw="btn btn-xs">
            1
          </a>
          <a href="#item2" tw="btn btn-xs">
            2
          </a>
          <a href="#item3" tw="btn btn-xs">
            3
          </a>
          <a href="#item4" tw="btn btn-xs">
            4
          </a>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="indicator" className="indicator">
          <span
            className="indicator-item"
            tw="indicator-item indicator-top indicator-start badge badge-secondary"
          >
            top+start
          </span>
          <span
            className="indicator-item indicator-center"
            tw="indicator-item indicator-top indicator-center badge badge-secondary"
          >
            top+center
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-top indicator-end badge badge-secondary"
          >
            top+end
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-middle indicator-start badge badge-secondary"
          >
            middle+start
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-middle indicator-center badge badge-secondary"
          >
            middle+center
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-middle indicator-end badge badge-secondary"
          >
            middle+end
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-bottom indicator-start badge badge-secondary"
          >
            bott0m+strt
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-bottom indicator-center badge badge-secondary"
          >
            bottom+center
          </span>
          <span
            className="indicator-item"
            tw="indicator-item indicator-bottom indicator-end badge badge-secondary"
          >
            bottom+end
          </span>
          <div tw="grid w-60 h-32 bg-base-300 place-items-center">content</div>
        </div>
      </div>
      <div tw="p-5 m-5">
        <div tw="hero min-h-screen bg-base-200">
          <div tw="hero-content flex-col lg:flex-row-reverse">
            <div tw="text-center lg:text-left">
              <h1 tw="text-5xl font-bold">Login now!</h1>
              <p tw="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
            </div>
            <div tw="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div tw="card-body">
                <div tw="form-control">
                  <label tw="label">
                    <span tw="label-text">Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="email"
                    tw="input input-bordered"
                  />
                </div>
                <div tw="form-control">
                  <label tw="label">
                    <span tw="label-text">Password</span>
                  </label>
                  <input
                    type="text"
                    placeholder="password"
                    tw="input input-bordered"
                  />
                  <label tw="label">
                    <a href="#" tw="label-text-alt link link-hover">
                      Forgot password?
                    </a>
                  </label>
                </div>
                <div tw="form-control mt-6">
                  <button tw="btn btn-primary">Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <input
      type="checkbox"
      id="my-modal"
      tw="modal-toggle"
      className="modal-toggle"
    />
    <div tw="modal" className="modal">
      <div tw="modal-box">
        <h3 tw="font-bold text-lg">Congratulations random Interner user!</h3>
        <p tw="py-4">
          You've been selected for a chance to get one year of subscription to
          use Wikipedia for free!
        </p>
        <div tw="modal-action" className="modal-action">
          <label htmlFor="my-modal" tw="btn">
            Yay!d
          </label>
        </div>
      </div>
    </div>
  </>
)
