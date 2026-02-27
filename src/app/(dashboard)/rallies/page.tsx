"use client";

import { useQuery } from "@apollo/client/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Loader2 } from "lucide-react";
import Link from "next/link";
import { RalliesTable } from "@/features/rallies/components/rallies-table";
import { GET_RALLIES } from "@/graphql/queries/rallies";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

interface GetRalliesData {
  rallies: any[];
}

export default function RalliesPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, loading, error } = useQuery<GetRalliesData>(GET_RALLIES, {
    variables: {
      language: "en",
      status: statusFilter,
      limit: 100,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const rallies = data?.rallies?.rallies || [];

  // Calculate stats
  const stats = {
    total: rallies.length,
    upcoming: rallies.filter((r: any) => r.status === "UPCOMING").length,
    ongoing: rallies.filter((r: any) => r.status === "ONGOING").length,
    recruiting: rallies.filter((r: any) => r.isRecruiting).length,
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rallies</h1>
          <p className="text-muted-foreground">
            Manage rallies, applications, and events
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/rallies/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Rally
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rallies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All rallies
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.upcoming}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled rallies
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.ongoing}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recruiting</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.recruiting}</div>
                <p className="text-xs text-muted-foreground">
                  Open for applications
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load rallies: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setStatusFilter(undefined)}>
              All
            </TabsTrigger>
            <TabsTrigger value="upcoming" onClick={() => setStatusFilter("UPCOMING")}>
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="ongoing" onClick={() => setStatusFilter("ONGOING")}>
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setStatusFilter("COMPLETED")}>
              Completed
            </TabsTrigger>
            <TabsTrigger value="draft" onClick={() => setStatusFilter("DRAFT")}>
              Draft
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading rallies...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RalliesTable rallies={rallies} />
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading rallies...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RalliesTable rallies={rallies} />
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading rallies...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RalliesTable rallies={rallies} />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading rallies...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RalliesTable rallies={rallies} />
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Loading rallies...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RalliesTable rallies={rallies} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
