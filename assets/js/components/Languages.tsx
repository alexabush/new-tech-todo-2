import * as React from 'react';

interface ApiResponse {
  data: Language[];
}
interface Language {
  id: number;
  name: string;
  proverb: string;
}
interface FetchDataExampleState {
  languages: Language[];
  loading: boolean;
}

export default class Languages extends React.Component<
  FetchDataExampleState,
  {}
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      languages: [],
      loading: true
    };
    fetch('/api/languages')
      .then(response => response.json() as Promise<ApiResponse>)
      .then(data => {
        this.setState({ languages: data.data, loading: false });
      });
  }
  render() {
    const content = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      <RenderLanguagesTable languages={this.state.languages} />
    );
    return <div>{content}</div>;
  }
}

export function RenderLanguagesTable({ languages }: Language[]) {
  return (
    <table>
      <thead>
        <tr>
          <th>Language</th>
          <th>Example proverb</th>
        </tr>
      </thead>
      <tbody>
        {languages.map(language => (
          <tr key={language.id}>
            <td>{language.name}</td>
            <td>{language.proverb}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
