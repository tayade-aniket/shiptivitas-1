import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);

    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => client.status === 'backlog'),
        inProgress: clients.filter(client => client.status === 'in-progress'),
        complete: clients.filter(client => client.status === 'complete'),
      },
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };

    this.drake = null;
  }

  componentDidMount() {
    this.drake = Dragula(
      [
        this.swimlanes.backlog.current,
        this.swimlanes.inProgress.current,
        this.swimlanes.complete.current,
      ],
      {
        removeOnSpill: false,
      }
    );

    this.drake.on('drop', this.handleDrop);
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  handleDrop = (el, target, source) => {
    const id = el.dataset.id;
    const newStatus = target && target.dataset ? target.dataset.status : null;
    const oldStatus = source && source.dataset ? source.dataset.status : null;

    if (!id || !newStatus || !oldStatus) {
      console.error('Drop event missing required attributes:', { id, newStatus, oldStatus });
      return;
    }

    if (newStatus !== oldStatus) {
      this.drake.cancel(true); // Prevent Dragula's DOM manipulation
      this.updateCardStatus(id, oldStatus, newStatus);
    }
  };

  updateCardStatus(id, oldStatus, newStatus) {
    const statusMap = {
      backlog: 'backlog',
      'in-progress': 'inProgress',
      complete: 'complete',
    };

    this.setState(prevState => {
      const movedCard = prevState.clients[statusMap[oldStatus]].find(client => client.id === id);
      if (!movedCard) {
        console.error(`Card with ID ${id} not found in ${oldStatus}`);
        return prevState;
      }

      // Update card status
      movedCard.status = newStatus;

      return {
        clients: {
          ...prevState.clients,
          [statusMap[oldStatus]]: prevState.clients[statusMap[oldStatus]].filter(client => client.id !== id),
          [statusMap[newStatus]]: [...prevState.clients[statusMap[newStatus]], movedCard],
        },
      };
    });
  }

  getClients() {
    return [
      { id: '1', name: 'Stark, White and Abbott', description: 'Cloned Optimal Architecture', status: 'in-progress' },
      { id: '2', name: 'Wiza LLC', description: 'Exclusive Bandwidth-Monitored Implementation', status: 'complete' },
      { id: '3', name: 'Nolan LLC', description: 'Vision-Oriented 4Thgeneration Graphicaluserinterface', status: 'backlog' },
      { id: '4', name: 'Thompson PLC', description: 'Streamlined Regional Knowledgeuser', status: 'in-progress' },
      { id: '5', name: 'Walker-Williamson', description: 'Team-Oriented 6Thgeneration Matrix', status: 'in-progress' },
      { id: '6', name: 'Boehm and Sons', description: 'Automated Systematic Paradigm', status: 'backlog' },
      { id: '7', name: 'Runolfsson, Hegmann and Block', description: 'Integrated Transitional Strategy', status: 'backlog' },
      { id: '8', name: 'Schumm-Labadie', description: 'Operative Heuristic Challenge', status: 'backlog' },
      { id: '9', name: 'Kohler Group', description: 'Re-Contextualized Multi-Tasking Attitude', status: 'backlog' },
      { id: '10', name: 'Romaguera Inc', description: 'Managed Foreground Toolset', status: 'backlog' },
      { id: '11', name: 'Reilly-King', description: 'Future-Proofed Interactive Toolset', status: 'complete' },
      { id: '12', name: 'Emard, Champlin and Runolfsdottir', description: 'Devolved Needs-Based Capability', status: 'backlog' },
      { id: '13', name: 'Fritsch, Cronin and Wolff', description: 'Open-Source 3Rdgeneration Website', status: 'complete' },
      { id: '14', name: 'Borer LLC', description: 'Profit-Focused Incremental Orchestration', status: 'backlog' },
      { id: '15', name: 'Emmerich-Ankunding', description: 'User-Centric Stable Extranet', status: 'in-progress' },
      { id: '16', name: 'Willms-Abbott', description: 'Progressive Bandwidth-Monitored Access', status: 'in-progress' },
      { id: '17', name: 'Brekke PLC', description: 'Intuitive User-Facing Customerloyalty', status: 'complete' },
      { id: '18', name: 'Bins, Toy and Klocko', description: 'Integrated Assymetric Software', status: 'backlog' },
      { id: '19', name: 'Hodkiewicz-Hayes', description: 'Programmable Systematic Securedline', status: 'backlog' },
      { id: '20', name: 'Murphy, Lang and Ferry', description: 'Organized Explicit Access', status: 'backlog' },
    ];
  }

  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane
        name={name}
        clients={clients}
        dragulaRef={ref}
        status={name.toLowerCase().replace(' ', '-')}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
