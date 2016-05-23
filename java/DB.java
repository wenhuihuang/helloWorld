package com.hwh.util;

import java.sql.*;

public class DB {
	private static DB db;
	static{
		db = new DB();
		try {
			Class.forName("com.mysql.jdbc.Driver");//加载数据库驱动
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	private DB(){};//构造方法
	//getConn --获取数据连接 ---DriverManager.getConnection 获取连接
	public static Connection getConn(){
		Connection conn = null;//声明连接
		String url = "jdbc:mysql://localhost:3306/shopping";
		String user = "root";
		String password = "";
		try {
			conn = DriverManager.getConnection(url, user, password);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	//关闭连接
	public static void closeConn(Connection conn){
		try{
			if(conn != null){
				conn.close();
				conn = null;
			}
		} catch(SQLException e){
			e.printStackTrace();
		}
	}
	//创建statement   ----用connection.createStatement创建  创建声明
	public static Statement createStmt(Connection conn){
		Statement stmt = null;
		try {
			stmt = conn.createStatement();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return stmt;
	}
	//关闭Statement
	public static void closeStmt(Statement stmt){
		try{
			if (stmt != null) {
				stmt.close();
				stmt = null;
			}
		} catch (SQLException e){
			e.printStackTrace();
		}
	}
	//获取preparedStatement
	public static PreparedStatement getPStmt(Connection conn, String sql){
		PreparedStatement PStmt = null;
		try{
			PStmt = conn.prepareStatement(sql);
			
		} catch (SQLException e){
			e.printStackTrace();
		}
		return PStmt;
	}
	//获取preparedStatement
	public static PreparedStatement getPStmt(Connection conn, String sql,boolean generatedKey){
		PreparedStatement PStmt = null;
		try{
			PStmt = conn.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
			
		} catch (SQLException e){
			e.printStackTrace();
		}
		return PStmt;
	}
	//获取结果 --返回结果
	public static ResultSet executeQuery(Statement stmt, String sql){
		ResultSet re = null;
		try{
			re = stmt.executeQuery(sql);
		} catch (SQLException e){
			e.printStackTrace();
		}
		return re;
	}
	public static ResultSet executeQuery(Connection conn, String sql){
		ResultSet re = null;
		try{
			Statement stmt = createStmt(conn);
			re = stmt.executeQuery(sql);
		} catch (SQLException e){
			e.printStackTrace();
		}
		return re;
	}
	//关闭resultSet
	public static void closeRe(ResultSet re){
		try{
			if(re != null){
				re.close();
				re=null;
			}
		}catch (SQLException e){
			e.printStackTrace();
		}
	}
	public static void executeUpdate(Connection conn, String sql) {
		PreparedStatement pstmt = null;
		try {
			pstmt = getPStmt(conn, sql);
			pstmt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
