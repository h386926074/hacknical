import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Label } from 'light-ui';
import styles from '../styles/github.css';
import dateHelper from 'UTILS/date';
import locales from 'LOCALES';
import ContributionChart from './ContributionChart';
import { contributionLevel } from './helper';

const githubTexts = locales('github').sections.orgs;
const fullDate = dateHelper.validator.fullDate;

class OrgRepos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeReposIndex: 0
    };
    this.changeAcitveRepos = this.changeAcitveRepos.bind(this);
  }

  changeAcitveRepos(index) {
    const { activeReposIndex } = this.state;
    if (activeReposIndex !== index) {
      this.setState({
        activeReposIndex: index
      });
    }
  }

  renderReposTipso(repository, contributionPercentage) {
    const {
      fork,
      name,
      language,
      html_url,
      created_at,
      pushed_at,
      forks_count,
      stargazers_count
    } = repository;

    return (
      <div className={styles.tipso_wrapper}>
        <div className={styles.tipso_container}>
          <span className={styles.tipso_title}>
            <a
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
            <Label
              theme="ghost"
              color="darkLight"
              text={`<${language}>`}
              clickable={false}
              style={{ lineHeight: 'normal' }}
            />
            {fork ? (
              <Label
                min
                color="darkLight"
                text="forked"
                icon="code-fork"
                clickable={false}
                className={styles.reposLabel}
              />
            ) : ''}
          </span>
          <span>{fullDate(created_at)} ~ {fullDate(pushed_at)}</span>
          <div className={styles.tipso_line} />
          <span>
            <i
              className="fa fa-star"
              aria-hidden="true"
            />
            &nbsp;{stargazers_count}
            &nbsp;&nbsp;&nbsp;
            <i
              className="fa fa-code-fork"
              aria-hidden="true"
            />
            &nbsp;{forks_count}
            &nbsp;&nbsp;
            <span
              className={cx(
              styles.info_strong,
              styles[`strong-${contributionLevel(contributionPercentage)}`]
              )}
            >
              {githubTexts.contributionPercentage}: {`${contributionPercentage.toFixed(2)}%`}
            </span>
          </span>
        </div>
      </div>
    );
  }

  renderRepos() {
    const { activeReposIndex } = this.state;
    const { repos, login } = this.props;

    const activeIndex = activeReposIndex >= repos.length ? 0 : activeReposIndex;
    return repos.map((repository, index) => {
      const { contributors } = repository;
      const filterContributions = contributors
        .filter(contributor => contributor.login === login);
      const totalContributions = contributors.reduce((prev, current, i) => {
        if (i === 0) {
          return current.total;
        }
        return current.total + prev;
      }, '');

      const userContributions = filterContributions.length ? filterContributions[0].total : 0;
      const percentage = totalContributions
        ? (userContributions / totalContributions) * 100
        : 0;
      const clickFunc = percentage
        ? () => this.changeAcitveRepos(index)
        : () => {};
      const contributionClass = cx(
        styles.repos_contributions,
        !percentage && styles.repos_contributions_disabled
      );

      return (
        <div className={styles.repos_item} key={index}>
          <div
            onClick={clickFunc}
            className={contributionClass}
          >
            <div
              style={{
                width: `${percentage}%`,
                opacity: percentage / 50
              }}
              className={styles.user_contributions}
            />
            {this.renderReposTipso(repository, percentage)}
          </div>
          {activeIndex === index && percentage ? (
            <ContributionChart
              percentage={percentage}
              repository={repository}
              contribution={filterContributions[0] || { weeks: [] }}
            />
          ) : ''}
        </div>
      );
    });
  }

  render() {
    const { repos } = this.props;

    return (
      <div>
        <div className={styles.org_info_title}>
          {githubTexts.joinedRepos}
        </div>
        {repos.length ? (
          <div className={styles.orgs_coordinate}>
            <div className={styles.repos_xAxes}>
              <div
                className={styles.xAxes_text}
              >
                {githubTexts.contributionPercentage}
              </div>
            </div>
            <div className={styles.repos_wrapper}>
              <div className={styles.repos}>
                {this.renderRepos()}
              </div>
              <div className={styles.repos_yAxes}>
                <div className={styles.yAxes_text}>stars</div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.orgs_coordinate}>暂无数据</div>
        )}
      </div>
    );
  }
}

OrgRepos.propTypes = {
  repos: PropTypes.array,
  login: PropTypes.string,
};

OrgRepos.defaultProps = {
  repos: [],
  login: ''
};

export default OrgRepos;
