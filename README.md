[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

# Quickstarts Synthetics library

The Quickstarts Synthetics library is a collection of Synthetics scripts and code examples for use in the New Relic platform. This library is used as a source for the nr1-quickstarts nerdlet available in the New Relic platform. This library is community sourced and open to contribution, so if you have some great synthetics scripts to share follow the manual below.

## Getting Started

Do you have some great synthetic scripts to share? Follow the steps below to add them to the library.

1. [Fork the Github repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository)

2. [Clone your own repository to your local machine](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

3. Copy the directory `library/_template` and it's content to a new directory within the `library` folder. Choose a name which identifies the main purpose of your quickstart, for example: `rabbitmq`, `apm-errors`, ...

4. Add your synthetic scripts in the `library/[your dir]/` folder. You can give your scripts any name, as the library will pick up any file with `.js` extension.

5. Edit the `quickstarts/[your dir]/config.yaml` file with your values. Make sure to give your scripts a clear description so users can identify what it does.

6. Commit your changes `git add -A` and `git commit -m "Added [name]"`. Change the `[name]` with a description of the synthetic script you've added.

7. Push your changes to Github `git push`

8. [Create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) in the [parent repository](https://github.com/newrelic/quickstarts-synthetics-library/compare?expand=1).

9. Submit and wait for review. We will review as fast as we can, but it can sometimes take a day or two.

Thanks a lot for your submission!

## Support

New Relic has open-sourced this project. This project is provided AS-IS WITHOUT WARRANTY OR DEDICATED SUPPORT. Issues and contributions should be reported to the project here on GitHub.

We encourage you to bring your experiences and questions to the [Explorers Hub](https://discuss.newrelic.com) where our community members collaborate on solutions and new ideas.

## Contribute

We encourage your contributions to improve the Quickstarts synthetics library! Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.

If you have any questions, or to execute our corporate CLA (which is required if your contribution is on behalf of a company), drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

If you would like to contribute to this project, review [these guidelines](./CONTRIBUTING.md).

To all contributors, we thank you!  Without your contribution, this project would not be what it is today.

## License
Quickstarts synthetics library is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
