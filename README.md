# TEngine &mdash; *3D graphics engine for the web*

## Synopsis

TEngine originally began under the name [Tristris 2](https://github.com/tristan00b/tristris-2), which was meant to be a sequel of sorts to [Tristris](https://github.com/tristan00b/tristris), a web-based Tetris game I had made. From very early on, it grew in the direction of a full-fledged rending engine. However, I had written everything in JavaScript, and as the project grew in complexity, so did the overhead of debugging an untyped language. As such, TEngine begins its life as a rewrite of Tristris 2 in TypeScript. For now this is a solo project, but we'll see how it goes. Maybe it will continue to grow and develop a community around it. Please see the [FAQ](#faq) for more general information.

Requisite disclaimer: This project is under initial development and should *not* be expected to be in any sort of usable state. But feel free to poke around and see what's here!



## Development

Note that, as I explain in the [FAQ](#faq), I am not accepting PR's at the moment. The information in this section is for myself, and anyone who wishes to play around with the existing code.



### Running Gulp tasks

Getting information on the provided Gulp tasks:
```
$ npx gulp --info

gulp watch

Launches the test server and watches the source directory for file changes, building the
application in development mode when file changes are observed.

Commands:
  gulp watch  Launches the test server and watches the source directory for file
              changes, building the application in development mode when file changes
              are observed.                                                    [default]
  gulp build  Builds the application in production mode.
  gulp test   Runs the test suite

Options:
  --help  Show help
  --port                                                        [number] [default: 4040]
```

The default task is `watch` (i.e. `npx gulp`, also equivalent to `npx gulp watch`).

Some commands have optional and/or required flags. For example `build` requires a `--url <host>` flag which is used in generating an application config file `app.config.json`. This flag is optional for the `watch` and `test` commands (default: `http://localhost:4040`) and specifies the address of the test server in addition to generating `app.config.json`.



### NPM scripts

There are several NPM scripts that provide convenient shortcuts for running Gulp tasks. These include:

```
npm start           # equivalent to `npx gulp` and `npx gulp watch`
npm run build <url> # equivalent to `npx gulp build --url <url>`
npm test            # equivalent to `npx gulp test`
npm run test:live   # equivalent to `npx gulp test --live`
```

To include flags for any Gulp tasks via `npm` requires using `--` before specifying the flags. For example, the equivalent to `npx gulp build --info` would be `npm run build -- --info`.



### Running tests

The test suite is divided into those tests that require network access and those that do not. Any test requiring network access must be placed into `test/live`. Running the `npm test` command will execute all tests in `test` while skipping those in `test/live`. Conversely, running `npm run test:live` will only execute tests in `test/live`. Executing live tests requires the test server to be running. For now, the `test:live` command will spin up it's own instance regardless of whether there is another instance running. This instance will exit after the tests have completed.



### Project directory structure

```
<project-root>
├── build
│   ├── cache
│   └── public
│       ├── assets
│       ├── docs
│       ├── engine
│       └── styles
├── src
│   ├── engine
│   │   ├── assets
│   │   └── gfx
│   ├── game
│   └── scss
└── test
    └── live
```

The project directory structure includes three top-level directories: `build`, `src`, and `test`. The is also `test/live` which is where to place any tests that require network access (see the section on `Running tests` for more details). The built application is output to `build/public` which includes any generated documentation at `build/public/docs`. By default, the test server will map these two directories to `http://localhost:4040` and `http://localhost:4040/docs` respectively.



## License

- *AGPL-3.0*&mdash;See `LICENSE` file for the terms of use.



## FAQ

- *Why another graphics engine? Why not just use &lt;my-favourite-engine&gt;?*
  I began this project for the purposes of fun and self-edification. I'm just doing my own thing here and do not expect that anyone would even want to use this prior to a great deal of development. So, by all means, go with your engine of choice!

- *Can I submit a PR?*
  For the time being, this is a personal project and I am not accepting PR's. However, I would likely be open to doing so in the future if the project continues to grow to an appreciable size.

- *Can I request features/provide feedback on your work?*
  Yes. Discussion is always open, although I may not be able to implement every feature requested... or any. I have yet to see how much time I will have and where this actually goes!

- *Can I use some/all of your code to in my own project?*
  You are permitted to use this code under the terms of APGL-3.0 license.

- *Why did you choose the AGPL-3.0 license?*
  I don't know. I tried my best to select the license most appropriate to my interests/goals. But I'm not a lawyer and I do not have extensive knowledge of software licenses. Discussion is always welcome!
