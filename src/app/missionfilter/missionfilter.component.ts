import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Mission } from "../models/missions";
import { SpacexapiService } from "../network/spacexapi.service";

@Component({
  selector: "app-missionfilter",
  templateUrl: "./missionfilter.component.html",
  styleUrls: ["./missionfilter.component.css"],
})
export class MissionfilterComponent implements OnInit {
  launchYears = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
  ];
  launchYearSelectedIndex: any;

  // Mission lists
  listMission: Mission[] = [];
  originalMissions: Mission[] = [];

  // Search term
  searchTerm: string = "";

  constructor(
    private spacexapiService: SpacexapiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spacexapiService.getAllList().subscribe((data: Mission[]): void => {
      this.originalMissions = data;
      this.listMission = data;
    });
  }

  missionFilter(index: number, year: string): void {
    this.getFilteredLaunches(year);
    this.launchYearSelectedIndex = index;
  }

  getFilteredLaunches(year: string): void {
    this.spacexapiService.getMissionFilter(year).subscribe(
      (data: any) => {
        this.listMission = data;
        // Update the original missions too so that search works on filtered data
        this.originalMissions = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  successLaunchFilter(value: boolean): void {
    this.getSuccessLaunch(value);
  }

  getSuccessLaunch(value: boolean): void {
    this.spacexapiService.getSuccessLaunch(value).subscribe(
      (data: any) => {
        this.listMission = data;
        this.originalMissions = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  successLandingFilter(value: boolean): void {
    this.getSuccessLanding(value);
  }

  getSuccessLanding(value: boolean): void {
    this.spacexapiService.getSuccessLanding(value).subscribe(
      (data: any) => {
        this.listMission = data;
        this.originalMissions = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  removeFilter(): void {
    this.searchTerm = "";
    this.getAll();
    this.launchYearSelectedIndex = null;
  }

  getAll(): void {
    this.spacexapiService.getAllList().subscribe(
      (data: any) => {
        this.originalMissions = data;
        this.listMission = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public getMissionIds(data: any): string {
    if (Array.isArray(data.mission_id)) {
      return data.mission_id.length > 0
        ? data.mission_id.join(", ")
        : "Not found :(";
    } else {
      return data.mission_id ? data.mission_id.toString() : "Not found :(";
    }
  }

  public searchMissions(): void {
    if (this.searchTerm.trim() === "") {
      this.listMission = this.originalMissions;
    } else {
      this.listMission = this.originalMissions.filter((mission: Mission) =>
        mission.mission_name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
